import sys
import re

textFile = "exampleText.txt"
logFile = "foundLog.txt"

keywords = {    #list of regex commands ment to seach for items
                "courseDes":      ["course description"] ,
                "courseObj":      ["objective(.)*course"] ,
                "courseCred":     ["[0-9](.)*credit"] ,
                "preReq":         ["pre(.)*requisite" , "pre(.)*req"] ,
                "gradeDet":       ["grading:"] ,
                "otherpolicies":  ["policy"] ,
                "instrName":      ["professor" , "Dr"] ,
                "instrContact":   ["e(-| )mail:" , "contact:"] ,
                "demoConsistant": [] , # not sure if this can be checked with keywords
                "assesMethod":    ["grading(.)*method"] ,
                "rubrics":        ["rubric"] , # may be missing
                "biblio":         ["bibliography"] ,
                "assignments":    ["assignments" , "bee"] ,
                "taskCrit":       [] ,
                "courseNum":      ["[0-9]{3}( |_)*(N|L|n|l)( |_)*[0-9]{3}" , "course( )*number" , "class( )*number" , "[0-9]{3}( )*(N|L|n|l)"] ,
                "format":         [] ,
                "attenPol":       ["attendance" , "attendance(.)policy" , "absent"] ,
                "reqRead":        ["required(.*)read" , "read(.*)required"] ,
                "courseDes":      ["course description" , "class description"] ,
                "acadHonest":     ["academic honesty" , "cheating" , "plagiarism"] ,
                "teachAct":       [] ,
                "accommod":       ["Students with disabilities"] ,
                "courseDes":      ["description"] ,
                "diversity":      [] , # not technically req
            }

found = {   #empty dictionary of arrays to store any matches to analyize later
            "courseDes":      [] ,
            "courseObj":      [] ,
            "courseCred":     [] ,
            "preReq":         [] ,
            "gradeDet":       [] ,
            "otherpolicies":  [] ,
            "instrName":      [] ,
            "instrContact":   [] ,
            "demoConsistant": [] , # not sure if this can be checked with keywords
            "assesMethod":    [] ,
            "rubrics":        [] , # may be missing
            "biblio":         [] ,
            "assignments":    [] ,
            "taskCrit":       [] ,
            "courseNum":      [] ,
            "format":         [] ,
            "attenPol":       [] ,
            "reqRead":        [] ,
            "courseDes":      [] ,
            "acadHonest":     [] ,
            "teachAct":       [] ,
            "accommod":       [] ,
            "courseDes":      [] ,
            "diversity":      [] , # not technically req
        }

cmdIdex = 0

def checkFileAnal():
    print("checking file...")
    #print(keywords)

    o = open(logFile, "a")
    o.write("\n\n\n\nOutput for " + "textFile") #text file will be the sylibus being evaluated

    s = open(textFile , "r")

    matches = 0
    cmdIdex = 0

    for key in keywords: #loops through entire dictionary
        o.write("\n\nResults for " + key + ":")
        for line in s: #loops through each line of sylibus
            cmdIdex = 0
            for i in keywords[key]: #loops through each regex search
                #print(i)
                cmdList = keywords[key]
                result = re.search(i , line) #searches line for regex command
                if(result != None):
                    matches += 1
                    found[key].append(result)
                    match = line[result.span()[0] : result.span()[1]]
                    o.write("\nMatch to \"" + i + "\" in line \"" + line[0 : -2] + "\": " + match)

        s.seek(0) #sets file pointer back to the begining

    print("file checked, " + str(matches) + " matches found")

    score = getScore()
    print("Score: " + score)
    
    return found


def checkFileFast():
    print("checking file...")
    #print(keywords)

    o = open(logFile, "a")
    o.write("\n\n\n\nOutput for " + "textFile") #text file will be the sylibus being evaluated

    s = open(textFile , "r")

    matches = 0
    cmdIdex = 0

    for key in keywords: #loops through entire dictionary
        o.write("\n\nResults for " + key + ":")
        for line in s: #loops through each line of sylibus
            cmdIdex = 0
            for i in keywords[key]: #loops through each regex search
                cmdList = keywords[key]
                result = re.search(i , line) #searches line for regex command
                if(result != None):
                    matches += 1
                    found[key] = result
                    match = line[result.span()[0] : result.span()[1]]
                    o.write("\nMatch to \"" + i + "\" in line \"" + line[0 : -2] + "\": " + match)
                    
        s.seek(0) #sets file pointer back to the begining

    print("file checked, " + str(matches) + " matches found")
    return found

def getScore():
    print("Score Calculateing")

    neededItems = 0
    foundItems = 0
    score = ""

    for key in keywords:
        neededItems += 1
        if(len(keywords[key]) != 0):
            foundItems += 1

    percent = foundItems / neededItems

    if(percent >= 1):
        score = "A+"
        return "A+"
    elif(percent >= .93):
        socre = "A"
        return "A"
    elif(percent >= .89):
        socre = "A-"
        return "A-"
    elif(percent >= .85):
        socre = "B+"
        return "B+"
    elif(percent >= .82):
        socre = "B"
        return "B"
    elif(percent >= .80):
        socre = "B-"
        return "B-"
    elif(percent >= .77):
        socre = "C+"
        return "C+"
    elif(percent >= .75):
        socre = "C"
        return "C"
    elif(percent >= .72):
        socre = "C-"
        return "C-"
    elif(percent >= .69):
        socre = "D+"
        return "D+"
    elif(percent >= .65):
        socre = "D"
        return "D"
    elif(percent >= .60):
        socre = "D-"
        return "D-"
    else:
        socre = "F"
        return "F"
    
            
        
checkFileAnal()
